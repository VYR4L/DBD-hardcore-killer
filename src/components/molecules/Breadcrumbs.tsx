import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
  <MuiBreadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
  {items.map((item, index) => {
  const isLast = index === items.length - 1;
  
  if (isLast || !item.path) {
    return (
    <Typography key={index} color="text.primary" fontWeight={600}>
    {item.label}
    </Typography>
    );
  }
  
  return (
    <Link
    key={index}
    component={RouterLink}
    to={item.path}
    underline="hover"
    color="inherit"
    >
    {item.label}
    </Link>
  );
  })}
  </MuiBreadcrumbs>
  );
};
